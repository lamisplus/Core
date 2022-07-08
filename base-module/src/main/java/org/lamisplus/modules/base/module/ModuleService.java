package org.lamisplus.modules.base.module;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.entities.*;
import org.lamisplus.modules.base.domain.entities.Module.Type;
import org.lamisplus.modules.base.domain.repositories.MenuRepository;
import org.lamisplus.modules.base.domain.repositories.ModuleArtifactRepository;
import org.lamisplus.modules.base.domain.repositories.ModuleDependencyRepository;
import org.lamisplus.modules.base.domain.repositories.ModuleRepository;
import org.lamisplus.modules.base.util.UnsatisfiedDependencyException;
import org.lamisplus.modules.base.yml.ConfigSchemaValidator;
import org.lamisplus.modules.base.yml.ModuleConfig;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.*;
import java.util.jar.Attributes;
import java.util.jar.JarInputStream;
import java.util.jar.Manifest;
import java.util.stream.Collectors;

import static org.lamisplus.modules.base.domain.entities.Module.Type.*;
import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;
import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.ARCHIVED;



@Service
@RequiredArgsConstructor
@Slf4j
public class ModuleService {
    private final ModuleManager moduleManager;
    private final ModuleRepository moduleRepository;
    private final MenuRepository menuRepository;
    private final ModuleArtifactRepository moduleArtifactRepository;
    private final ModuleDependencyRepository moduleDependencyRepository;
    private final ModuleDeleteService moduleDeleteService;
    private final ModuleFileStorageService storageService;
    private static final ObjectMapper MAPPER;

    static {
        MAPPER = new ObjectMapper(new YAMLFactory());
        MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        MAPPER.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
    }

    @Transactional
    public ModuleResponse activate(Module module) {
        LOG.debug("Activating module {} ...", module);

        module.setActive(true);
        moduleRepository.save(module);

        //get all menu and activate
        List<Menu> menus = menuRepository.findAllByModuleId(module.getId()).stream()
                .map(menu -> {menu.setArchived(UN_ARCHIVED); return menu;})
                .collect(Collectors.toList());
        menuRepository.saveAll(menus);

        return moduleManager.bootstrapModule(module, false, false);
    }



    @Transactional
    public ModuleResponse deactivate(Module module) {
        LOG.debug("Deactivating module {} ...", module);
        module.setActive(false);
        moduleRepository.save(module);

        List<Menu> menus = menuRepository.findAllByModuleId(module.getId()).stream()
                .map(menu -> {menu.setArchived(ARCHIVED); return menu;})
                .collect(Collectors.toList());
        menuRepository.saveAll(menus);
        return moduleManager.shutdownModule(module, false, false);
    }

    @Transactional
    public ModuleResponse installModule(Module module, Boolean install, Boolean multi) {
        if (!module.isNew()) {
            List<ModuleDependency> dependencies = moduleDependencyRepository.findDependencies(module);
            dependencies.forEach(dependency -> {
                if (!moduleManager.isInstalled(dependency.getDependency())) {
                    installModule(dependency.getDependency(), false, multi);
                }
            });
        } else {
            ModuleResponse moduleResponse = installDependencies(module, multi);
            if (moduleResponse.getType().equals(ModuleResponse.Type.ERROR)) {
                return moduleResponse;
            }

        }
        return moduleManager.bootstrapModule(module, install, multi);
    }

    @Transactional
    public ModuleResponse update(Module updateModule, Boolean multi) {
        final ModuleResponse[] response = {installDependencies(updateModule, multi)};
        if (response[0].getType().equals(ModuleResponse.Type.ERROR)) {
            return response[0];
        }
        moduleRepository.findByName(updateModule.getName()).ifPresent(module1 -> {
            List<ModuleDependency> dependencies = moduleDependencyRepository.findDependents(module1);
            moduleDependencyRepository.deleteAll(dependencies);
            moduleArtifactRepository.findByModule(module1).ifPresent(moduleArtifactRepository::delete);
            moduleDeleteService.deleteModule(module1);
            /*moduleManager.shutdownModule(module1, false, true);
            response[0] = installModule(module, true, true);*/

            Module module = updateModule;
            module.setInstallOnBoot(true);
            List<ModuleConfig> configs = new ArrayList<>();
            try {
                ModuleUtils.loadModuleConfig(storageService.readFile(module.getArtifact()), "module.yml", configs);
                if (!configs.isEmpty()) {
                    Map<String, String> dependencyMap = configs.get(0).getDependencies();
                    List<ModuleDependency> moduleDependencies = new ArrayList<>();
                    Module finalModule1 = module;
                    dependencyMap.forEach((name, version) -> {
                        if (!name.equals("BaseModule")) {
                            Optional<Module> m = moduleRepository.findByName(name);
                            if (!m.isPresent()) {
                                throw new UnsatisfiedDependencyException(
                                        String.format("Unsatisfied module requirement: %s not installed.", name));
                            } else {
                                ModuleDependency moduleDependency = new ModuleDependency();
                                moduleDependency.setModule(finalModule1);
                                moduleDependency.setDependency(m.get());
                                moduleDependency.setVersion(version);
                                moduleDependencies.add(moduleDependency);
                            }
                        }
                    });
                    module.getDependencies().addAll(moduleDependencies);
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }

            module = moduleRepository.save(module);
            ModuleArtifact artifact = new ModuleArtifact();
            artifact.setModule(module);
            try {
                InputStream stream = storageService.readFile(module.getArtifact());
                byte[] data = IOUtils.toByteArray(stream);
                artifact.setData(data);
                moduleArtifactRepository.save(artifact);
                stream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            Module finalModule = module;
            dependencies = dependencies.stream()
                    .map(d -> {
                        d.setDependency(finalModule);
                        return d;
                    })
                    .collect(Collectors.toList());
            moduleDependencyRepository.saveAll(dependencies);
            response[0].setMessage("Module successfully updated; please restart service");
            response[0].setModule(module);
        });
        return response[0];
    }

    @Transactional
    public ModuleResponse uninstall(Module module, Boolean uninstall) {
        return moduleManager.shutdownModule(module, uninstall, false);
    }

    @SneakyThrows
    public Module uploadModuleData(MultipartFile file) {
        List<ModuleConfig> configs = new ArrayList<>();
        Module module = new Module();
        InputStream inputStream = null;
        try {
            inputStream = file.getInputStream();
            ModuleUtils.loadModuleConfig(inputStream, "module.yml", configs);
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if (inputStream != null){
                inputStream.close();
            }
        }

        if (configs.size() > 0) {
            ModuleConfig config = configs.get(0);
            /*String yaml = MAPPER.writeValueAsString(config);
            if(!ConfigSchemaValidator.isValid(yaml)){
                module.setType(ERROR);
                module.setMessage("module.yml not well formed and validation failed");
                return module;
            }*/

            String fileName = storageService.store(config.getName(), file);
            ModuleUtils.loadModuleConfig(storageService.readFile(fileName), "module.yml", configs);
            ModuleManager.VersionInfo versionInfo = readVersionInfo(storageService.readFile(fileName));
            module.setArtifact(fileName);
            module.setName(config.getName());
            module.setVersion(versionInfo.version);
            module.setDescription(versionInfo.projectName);
            module.setUmdLocation(config.getUmdLocation());
            module.setBasePackage(config.getBasePackage());
            module.setPermissions(config.getPermissions()
                    .stream()
                    .map(permission -> {permission.setModuleName(config.getName()); return permission;})
                            .collect(Collectors.toSet()));
            //module.setPermissions(new HashSet<>(config.getPermissions()));
            module.setPriority(config.getPriority());
            if(!config.getDependencies().isEmpty()){
                //List<String> dependencies = new ArrayList<>();
                config.getDependencies().forEach((k, v)->{
                    //dependencies.add(k +" "+ v);
                    if(!moduleManager.isInstalled(k)){
                        module.setType(ERROR);
                        module.setMessage(module.getName() + " depends on " + k +" "+ v);
                    } else  if(!moduleRepository.findByNameAndVersionAndActive(k, v, true).isPresent()){
                        module.setType(ERROR);
                        module.setMessage(module.getName() + " depends on " + k +" "+ v);
                    }
                });
            }
        }
        return module;
    }

    @SneakyThrows
    public Module uploadModuleData(String fileName, InputStream inputStream) {
        List<ModuleConfig> configs = new ArrayList<>();
        Module module = new Module();
        ModuleUtils.loadModuleConfig(inputStream, "module.yml", configs);

        if (configs.size() > 0) {
            ModuleConfig config = configs.get(0);
            fileName = storageService.store(config.getName(), fileName, inputStream);
            ModuleManager.VersionInfo versionInfo = readVersionInfo(inputStream);
            module.setArtifact(fileName);
            module.setName(config.getName());
            module.setVersion(versionInfo.version);
            module.setDescription(versionInfo.projectName);
            module.setUmdLocation(config.getUmdLocation());
            module.setBasePackage(config.getBasePackage());
            module.setPriority(config.getPriority());
        }
        return module;
    }

    private ModuleResponse installDependencies(Module module, Boolean multi) {
        ModuleConfig moduleConfig = moduleManager.getModuleConfig(module);
        if (moduleConfig != null) {
            Map<String, String> dependencies = moduleConfig.getDependencies();
            final boolean[] error = {false};
            final ModuleResponse[] response = {new ModuleResponse()};
            response[0].setType(ModuleResponse.Type.ERROR);
            dependencies.keySet().stream()
                    .filter(n -> !n.equals("BaseModule"))
                    .forEach(name -> {
                        response[0].setMessage(String.format("Dependency %s not installed; cannot install module", name));
                        response[0] = moduleRepository.findByName(name).flatMap(dependency -> {
                            ModuleResponse response1 = new ModuleResponse();
                            response1.setMessage(String.format("Dependency %s not installed; cannot install module", name));
                            response1.setType(ModuleResponse.Type.SUCCESS);
                            if (!moduleManager.isInstalled(dependency)) {
                                response1 = installModule(module, false, multi);
                            }
                            return Optional.of(response1);
                        }).orElse(response[0]);
                        if (response[0].getType().equals(ModuleResponse.Type.ERROR)) {
                            error[0] = true;
                        }
                    });
            if (error[0]) {
                return response[0];
            }
        }
        ModuleResponse response = new ModuleResponse();
        response.setType(ModuleResponse.Type.SUCCESS);
        return response;
    }

    @SneakyThrows
    ModuleManager.VersionInfo readVersionInfo(InputStream jarIs) {
        ModuleManager.VersionInfo versionInfo = ModuleManager.VersionInfo.UNKNOWN;

        JarInputStream jarStream = new JarInputStream(jarIs);
        Manifest manifest = jarStream.getManifest();
        if (manifest != null) {
            Attributes attr = manifest.getMainAttributes();

            versionInfo = new ModuleManager.VersionInfo();
            versionInfo.manifest = manifest;
            versionInfo.available = true;
            versionInfo.projectName = StringUtils.defaultString(
                    attr.getValue("Implementation-Title"), ModuleManager.VersionInfo.UNKNOWN_VALUE
            );
            versionInfo.version = StringUtils.defaultString(
                    attr.getValue("Implementation-Version"), ModuleManager.VersionInfo.UNKNOWN_VALUE
            );

            String buildTime = attr.getValue("Build-Time");

            if (buildTime != null) {
                try {
                    versionInfo.buildTime = DateUtils.parseDate(buildTime, "yyyyMMdd-HHmm",
                            "yyyy-MM-dd'T'HH:mm:ss'Z'");
                } catch (ParseException ignored) {

                }
            }
            jarStream.close();
        }
        return versionInfo;
    }

    public ModuleResponse updateDetails(Long id, Module module) {
        Module foundModule = moduleRepository.findById(id).orElseThrow(()-> new EntityNotFoundException(Module.class, "id", ""+id));
        foundModule.setDescription(module.getDescription());
        module = moduleRepository.save(foundModule);
        ModuleResponse response = new ModuleResponse();
        response.setType(ModuleResponse.Type.SUCCESS);
        response.setMessage("Module details updated successfully");
        response.setModule(module);
        return response;
    }

    public boolean exist(String moduleName){
        moduleName = "%"+moduleName+"%";
        return moduleRepository.findLikeByMenu(moduleName).isPresent();
    }
}

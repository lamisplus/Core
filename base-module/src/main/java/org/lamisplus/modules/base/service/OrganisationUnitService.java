package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entities.*;
import org.lamisplus.modules.base.domain.repositories.OrganisationUnitHierarchyRepository;
import org.lamisplus.modules.base.domain.repositories.OrganisationUnitIdentifierRepository;
import org.lamisplus.modules.base.domain.repositories.OrganisationUnitRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.ARCHIVED;
import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitService {
    private static final Long FIRST_ORG_LEVEL = 1L;
    public static final int IP_CODE = 20000000;
    public static final long FACILITY_CODE = 4;
    private final OrganisationUnitRepository organisationUnitRepository;
    private final OrganisationUnitIdentifierRepository organisationUnitIdentifierRepository;
    private final OrganisationUnitHierarchyRepository organisationUnitHierarchyRepository;

    public List<OrganisationUnit> save(
            Long parentOrganisationUnitId,
            Long organisationUnitLevelId,
            List<OrganisationUnitDTO> organisationUnitDTOS) {
        List<OrganisationUnit> organisationUnits = new ArrayList<> ();
        OrganisationUnit orgUnit = organisationUnitRepository.findByIdAndArchived (parentOrganisationUnitId, UN_ARCHIVED)
                .orElseThrow (() -> new EntityNotFoundException (
                        OrganisationUnitLevel.class,
                        "parentOrganisationUnitId", parentOrganisationUnitId + ""));

        OrganisationUnitLevel organisationUnitLevel = orgUnit.getOrganisationUnitLevelByOrganisationUnitLevelId ();
        //if has no subset is 0 while has subset is 1
        if (organisationUnitLevel.getStatus () == 0) {
            throw new IllegalTypeException (OrganisationUnitLevel.class, "parentOrganisationUnitLevel", organisationUnitLevel + " cannot have subset");
        }

        //loop to extract organisationUnit from dto and save
        organisationUnitDTOS.forEach (organisationUnitDTO -> {

            Optional<OrganisationUnit> organizationOptional =
                    organisationUnitRepository.findByNameAndParentOrganisationUnitIdAndArchived (
                            organisationUnitDTO.getName (),
                            organisationUnitDTO.getId (), UN_ARCHIVED);

            if (organizationOptional.isPresent ())
                throw new RecordExistException (OrganisationUnit.class, "Name", organisationUnitDTO.getName () + "");

            final OrganisationUnit organisationUnit = toOrganisationUnit (organisationUnitDTO);
            //Set parentId
            organisationUnit.setParentOrganisationUnitId (parentOrganisationUnitId);
            //Set organisation unit level
            organisationUnit.setOrganisationUnitLevelId (organisationUnitLevelId);
            //Save organisation unit
            OrganisationUnit organisationUnit1 = organisationUnitRepository.save (organisationUnit);

            List<OrganisationUnitHierarchy> organisationUnitHierarchies = new ArrayList<> ();
            OrganisationUnit returnOrgUnit = organisationUnit1;

            Long parentOrgUnitId = 1L;
            while (parentOrgUnitId > 0) {
                parentOrgUnitId = organisationUnit1.getParentOrganisationUnitId ();
                organisationUnitHierarchies.add (new OrganisationUnitHierarchy (
                        null, returnOrgUnit.getId (),
                        organisationUnit1.getParentOrganisationUnitId (),
                        organisationUnitLevelId, null,
                        null, null));

                Optional<OrganisationUnit> organisationUnitOptional =
                        organisationUnitRepository.findById (organisationUnit1.getParentOrganisationUnitId ());
                if (organisationUnitOptional.isPresent ()) {
                    organisationUnit1 = organisationUnitOptional.get ();
                }
                -- parentOrgUnitId;
            }
            organisationUnitHierarchyRepository.saveAll (organisationUnitHierarchies);
            organisationUnits.add (returnOrgUnit);
        });
        return organisationUnits;
    }

    //TODO: work on update organisation unit
    public OrganisationUnit update(Long id, OrganisationUnitDTO organisationUnitDTO) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived (id, UN_ARCHIVED);
        if (! organizationOptional.isPresent ())
            throw new EntityNotFoundException (OrganisationUnit.class, "Id", id + "");
        final OrganisationUnit organisationUnit = toOrganisationUnit (organisationUnitDTO);
        organisationUnit.setId (id);
        return organisationUnitRepository.save (organisationUnit);
    }

    public Integer delete(Long id) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived (id, UN_ARCHIVED);
        if (! organizationOptional.isPresent ())
            throw new EntityNotFoundException (OrganisationUnit.class, "Id", id + "");
        organizationOptional.get ().setArchived (ARCHIVED);
        return organizationOptional.get ().getArchived ();
    }

    public OrganisationUnit getOrganizationUnit(Long id) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived (id, UN_ARCHIVED);
        if (! organizationOptional.isPresent ())
            throw new EntityNotFoundException (OrganisationUnit.class, "Id", id + "");
        return organizationOptional.get ();
    }

    public List<OrganisationUnit> getOrganisationUnitByParentOrganisationUnitId(Long id) {
        if(id != null && id > IP_CODE){
            List<CentralPartnerMapping> mappings = organisationUnitRepository.findByOrgUnitInIp(id);
            //if data fi or other agency higher than IPs
            if(mappings.isEmpty() && organisationUnitRepository.findById(id).isPresent()){
                return organisationUnitRepository.findAllByOrganisationUnitLevelId(FACILITY_CODE);
            }
            return mappings.stream()
                    .map(mapping->{
                        OrganisationUnit orgUnit = new OrganisationUnit();
                        orgUnit.setName(mapping.getFacilityName());
                        orgUnit.setId(mapping.getId());
                        return orgUnit;
                    })
                    .collect(Collectors.toList());
        }
        return organisationUnitRepository.findAllOrganisationUnitByParentOrganisationUnitIdAndArchived (id, UN_ARCHIVED);
    }

    public Page<OrganisationUnit> getAllOrganizationUnit(Pageable pageable) {
        return organisationUnitRepository.findAllByArchivedOrderByIdAsc (UN_ARCHIVED, pageable);
    }

    public List<OrganisationUnit> getAllOrganizationUnit(Page<OrganisationUnit> organisationUnitPage) {
        List<OrganisationUnit> organisationUnits = new ArrayList<> ();
        organisationUnitPage.getContent ().forEach (organisationUnit -> organisationUnits
                .add (this.findOrganisationUnits (organisationUnit, organisationUnit.getId ())));
        return organisationUnits;
    }

    public List<OrganisationUnitDTO> getOrganisationUnitSubsetByParentOrganisationUnitIdAndOrganisationUnitLevelId(Long parentOrgUnitId, Long orgUnitLevelId) {
        List<OrganisationUnitHierarchy> organisationUnitHierarchies =
                organisationUnitHierarchyRepository.findAllByParentOrganisationUnitIdAndOrganisationUnitLevelId (parentOrgUnitId, orgUnitLevelId);
        List<OrganisationUnitDTO> organisationUnitDTOS = new ArrayList<> ();
        organisationUnitHierarchies.forEach (organisationUnitHierarchy -> {
            OrganisationUnit organisationUnit = organisationUnitHierarchy.getOrganisationUnitByOrganisationUnitId ();
            Long orgUnitId = organisationUnit.getParentOrganisationUnitId ();
            organisationUnitDTOS.add (toOrganisationUnitDTO (this.findOrganisationUnits (organisationUnit, orgUnitId)));
        });
        return organisationUnitDTOS;
    }

    public List<OrganisationUnit> getAllOrganisationUnitByOrganisationUnitLevelId(Long organisationUnitLevelId) {
        List<Long> levels = new ArrayList<> ();
        for (Long i = FIRST_ORG_LEVEL; i < organisationUnitLevelId; i++) {
            levels.add (i);
        }
        return organisationUnitRepository.findAllByOrganisationUnitLevelIdIn (levels);
    }

    public OrganisationUnit findOrganisationUnits(OrganisationUnit organisationUnit, Long orgUnitId) {
        for (int i = 0; i < 2; i++) {
            Optional<OrganisationUnit> optionalOrganisationUnit = organisationUnitRepository.findByIdAndArchived (orgUnitId, UN_ARCHIVED);
            if (optionalOrganisationUnit.isPresent ()) {
                if (organisationUnit.getParentOrganisationUnitName () == null) {
                    organisationUnit.setParentOrganisationUnitName (optionalOrganisationUnit.get ().getName ());
                } else if (organisationUnit.getParentParentOrganisationUnitName () == null) {
                    organisationUnit.setParentParentOrganisationUnitName (optionalOrganisationUnit.get ().getName ());
                }
                orgUnitId = optionalOrganisationUnit.get ().getParentOrganisationUnitId ();
            }
        }
        return organisationUnit;
    }


    public OrganisationUnit toOrganisationUnit(OrganisationUnitDTO organisationUnitDTO) {
        if (organisationUnitDTO == null) {
            return null;
        }
        OrganisationUnit organisationUnit = new OrganisationUnit ();
        organisationUnit.setId (organisationUnitDTO.getId ());
        organisationUnit.setName (organisationUnitDTO.getName ());
        organisationUnit.setDescription (organisationUnitDTO.getDescription ());
        organisationUnit.setOrganisationUnitLevelId (organisationUnitDTO.getOrganisationUnitLevelId ());
        organisationUnit.setParentOrganisationUnitId (organisationUnitDTO.getParentOrganisationUnitId ());
        organisationUnit.setDetails (organisationUnitDTO.getDetails ());
        organisationUnit.setParentOrganisationUnitName (organisationUnitDTO.getParentOrganisationUnitName ());
        organisationUnit.setParentParentOrganisationUnitName (organisationUnitDTO.getParentParentOrganisationUnitName ());

        return organisationUnit;
    }

    public OrganisationUnitDTO toOrganisationUnitDTO(OrganisationUnit organisationUnit) {
        if (organisationUnit == null) {
            return null;
        }
        OrganisationUnitDTO organisationUnitDTO = new OrganisationUnitDTO ();
        organisationUnitDTO.setId (organisationUnit.getId ());
        organisationUnitDTO.setName (organisationUnit.getName ());
        organisationUnitDTO.setDescription (organisationUnit.getDescription ());
        organisationUnitDTO.setOrganisationUnitLevelId (organisationUnit.getOrganisationUnitLevelId ());
        organisationUnitDTO.setParentOrganisationUnitId (organisationUnit.getParentOrganisationUnitId ());
        organisationUnitDTO.setParentOrganisationUnitName (organisationUnit.getParentOrganisationUnitName ());
        organisationUnitDTO.setParentParentOrganisationUnitName (organisationUnit.getParentParentOrganisationUnitName ());
        organisationUnitDTO.setDetails (organisationUnit.getDetails ());
        return organisationUnitDTO;
    }

    /*public List getAll(){
        List orgList = new ArrayList();
        try {
            orgList = this.readDataFromExcelFile("C:\\Users\\Dell\\Documents\\PALLADIUM WORKS\\PALLADIUM WORKS\\FACILITIES\\FACILITY\\datim_facility.xlsx");
            organisationUnitIdentifierRepository.saveAll(orgList);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return orgList;
    }

    public List<OrganisationUnitIdentifier> readDataFromExcelFile(String excelFilePath) throws IOException {

        List<OrganisationUnitIdentifier> organisationUnitIdentifiers = new ArrayList<>();
        List<OrganisationUnitExtraction> organisationUnitExtractions = new ArrayList<>();
        List<OrganisationUnitDTO> organisationUnitDTOS = new ArrayList<>();


        FileInputStream inputStream = new FileInputStream(excelFilePath);
        try {

            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);

            Sheet firstSheet = workbook.getSheetAt(0);

            Iterator<Row> iterator = firstSheet.iterator();
            while (iterator.hasNext()) {
                Row nextRow = iterator.next();
                Iterator<Cell> cellIterator = nextRow.cellIterator();
                OrganisationUnitExtraction organisationUnitExtraction = new OrganisationUnitExtraction();
                OrganisationUnitDTO organisationUnitDTO = new OrganisationUnitDTO();
                OrganisationUnitIdentifier organisationUnitIdentifier = new OrganisationUnitIdentifier();

                while (cellIterator.hasNext()) {
                    Cell nextCell = cellIterator.next();
                    int columnIndex = nextCell.getColumnIndex();
                    String parentOrganisationUnitName = "";
                    Long id;
                    String name = "";
                    switch (columnIndex) {
                        case 0:
                            //State
                            String parentParentOrganisationUnitName = String.valueOf(nextCell).trim();
                            organisationUnitExtraction.setParentParentOrganisationUnitName(parentParentOrganisationUnitName);
                            OrganisationUnit state = organisationUnitRepository.findLikeOrganisationUnit("%"+organisationUnitExtraction.getParentParentOrganisationUnitName()+"%",
                                            1,2, 0)
                                    .orElseThrow(()-> new EntityNotFoundException(OrganisationUnit.class, "name", organisationUnitExtraction.getParentParentOrganisationUnitName()));
                            //LOG.info("state is {}", state);
                            organisationUnitExtraction.setParentParentOrganisationUnitId(state.getId());
                            break;
                        case 1:
                            //LGA
                            parentOrganisationUnitName = String.valueOf(nextCell).trim();
                            //LOG.info("lga name is {}", parentOrganisationUnitName);
                            organisationUnitExtraction.setParentOrganisationUnitName(parentOrganisationUnitName);
                            Optional<OrganisationUnit> lga = organisationUnitRepository.findLikeOrganisationUnit("%"+organisationUnitExtraction.getParentOrganisationUnitName()+"%",
                                            organisationUnitExtraction.getParentParentOrganisationUnitId(),3, 0);
                            if(lga.isPresent()) {
                                //LOG.info("lga is {}", lga.get());
                                organisationUnitExtraction.setParentOrganisationUnitId(lga.get().getId());
                            }
                            break;
                        case 2:
                            //facility
                            organisationUnitExtraction.setOrganisationUnitName(String.valueOf(nextCell).trim());
                            OrganisationUnit facility;
                            if(organisationUnitExtraction.getParentOrganisationUnitId() == null){
                                facility= organisationUnitRepository.findLikeOrganisationUnitInState("%"+organisationUnitExtraction.getOrganisationUnitName()+"%",4, 0)
                                        .orElseThrow(()-> new EntityNotFoundException(OrganisationUnit.class, "name", organisationUnitExtraction.getOrganisationUnitName()));
                            } else {
                                facility = organisationUnitRepository.findLikeOrganisationUnit("%"+organisationUnitExtraction.getOrganisationUnitName()+"%",
                                                organisationUnitExtraction.getParentOrganisationUnitId(),4, 0)
                                        .orElseThrow(()-> new EntityNotFoundException(OrganisationUnit.class, "name", organisationUnitExtraction.getOrganisationUnitName()));
                            }
                            //LOG.info("facility is {}", facility);
                            organisationUnitIdentifier.setOrganisationUnitId(facility.getId());
                            //System.out.println(getCellValue(nextCell));
                            break;

                        case 3:
                            //Datim
                            String datimId = String.valueOf(nextCell).trim();
                            organisationUnitExtraction.setDatimId(datimId);

                            organisationUnitDTO.setName(organisationUnitExtraction.getOrganisationUnitName());
                            organisationUnitDTO.setDescription(organisationUnitExtraction.getDescription());
                            organisationUnitDTO.setOrganisationUnitLevelId(4L);
                            organisationUnitDTO.setParentOrganisationUnitId(organisationUnitExtraction.getParentOrganisationUnitId());
                            organisationUnitIdentifier.setName("DATIM_ID");
                            organisationUnitIdentifier.setCode(datimId);
                            LOG.info("organisationUnitIdentifier is {}", organisationUnitIdentifier);
                            //save(organisationUnitDTO);
                    }
                }

                //organisationUnitDTOS.add(organisationUnitDTO);
                //organisationUnitExtractions.add(organisationUnitExtraction);
                organisationUnitIdentifiers.add(organisationUnitIdentifier);
            }
            inputStream.close();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            inputStream.close();
        }
        return organisationUnitIdentifiers;
    }

    private Object getCellValue(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case NUMERIC:
                return cell.getNumericCellValue();
        }
        return null;
    }

    public OrganisationUnit save(OrganisationUnitDTO organisationUnitDTO) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByNameAndParentOrganisationUnitIdAndArchived(organisationUnitDTO.getName(), organisationUnitDTO.getId(), 0);
        if(organizationOptional.isPresent())throw new RecordExistException(OrganisationUnit.class, "Name", organisationUnitDTO.getName() +"");
        final OrganisationUnit organisationUnit = this.toOrganisationUnit(organisationUnitDTO);

        Log.info("OrganisationUnitDTO {}", organisationUnitDTO);
        OrganisationUnit organisationUnit1 = organisationUnitRepository.save(organisationUnit);
        Long level = organisationUnit1.getOrganisationUnitLevelId();
        List<OrganisationUnitHierarchy> organisationUnitHierarchies = new ArrayList<>();
        OrganisationUnit returnOrgUnit = organisationUnit1;

        Long parent_org_unit_id = 1L;
        while(parent_org_unit_id > 0){
            parent_org_unit_id = organisationUnit1.getParentOrganisationUnitId();
            organisationUnitHierarchies.add(new OrganisationUnitHierarchy(null, returnOrgUnit.getId(), organisationUnit1.getParentOrganisationUnitId(),
                    level, null, null, null));

            Optional<OrganisationUnit> organisationUnitOptional = organisationUnitRepository.findById(organisationUnit1.getParentOrganisationUnitId());
            if(organisationUnitOptional.isPresent()){
                organisationUnit1 = organisationUnitOptional.get();
            }
            --parent_org_unit_id;
        }
        organisationUnitHierarchyRepository.saveAll(organisationUnitHierarchies);
        return returnOrgUnit;
    }*/
}

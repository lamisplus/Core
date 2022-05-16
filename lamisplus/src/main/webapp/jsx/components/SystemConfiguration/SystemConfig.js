import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import {env} from "./../../../actions/systemInfo";
import {  Table,} from "react-bootstrap";

let newConfigList=[]

const SystemConfig = (props) => {

    useEffect(() => {
        fetchSystemEnv()  
      }, []);

    const fetchSystemEnv =()=>{
      const onSuccess = () => {
       
      };
      const onError = () => {
      };
      props.fetchEnv(onSuccess, onError);
    }
   ///console.log(newList[0])
   const systemProperties = props.SystemInfo && props.SystemInfo.propertySources ? props.SystemInfo.propertySources : []
        
   systemProperties.forEach(function (value, index, array) {
    if(value['name']==='across'){
      //console.log(value['properties'])
      return newConfigList=Object.entries(value['properties']).map(([key, value]) => ({
        label: key,
        value: value,
      }))
    }
   
  })
    //console.log(newConfigList)

  return (
         <Fragment>      
            <Table striped bordered hover size="sm">
            <thead>
                <tr>
                <th>Property</th>
                <th>Value</th>
                
                </tr>
            </thead>
            <tbody>
            { newConfigList.map((row) => (
                <tr>
                <td>{row.label}</td>
                <td>{row.value.value}</td>
                
                </tr>
            ))}
            </tbody>
            </Table>
                   
     
    </Fragment>
  );
};

const mapStateToProps = (state) => {
    return {
        SystemInfo: state.SystemInfo.list,
    };
  };
  
  const mapActionToProps = {
    fetchEnv: env,
  };
  
export default connect(mapStateToProps, mapActionToProps)(SystemConfig);


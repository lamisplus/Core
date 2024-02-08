import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const ServerInstalled = () => {
    const listOfAllModule = useSelector(state => state.boostrapmodule.list);
    const [hasServerInstalled, setHasServerInstalled] = useState(false);
    
    useEffect(() => {
        if (listOfAllModule) {
            if(listOfAllModule.length > 0){
                listOfAllModule.map((item) => {
                    if(item.name === 'ServerSyncModule'){
                        setHasServerInstalled(true);
                    }
                });
            }
        }
    
    },[listOfAllModule]);

    return hasServerInstalled;

}
export default ServerInstalled;
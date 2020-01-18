package ru.AvatarSpace.Event;

import com.smartfoxserver.v2.core.*;
import com.smartfoxserver.v2.db.IDBManager;
import com.smartfoxserver.v2.exceptions.*;
import com.smartfoxserver.v2.extensions.*;
import com.smartfoxserver.v2.entities.*;
import com.smartfoxserver.v2.entities.data.*;
import com.smartfoxserver.v2.entities.variables.SFSUserVariable;
import com.smartfoxserver.v2.entities.variables.UserVariable;
import java.sql.SQLException;
import java.util.ArrayList;

public class JoinZone extends BaseServerEventHandler{
    @Override
    public void handleServerEvent(ISFSEvent event) throws SFSException {
        User user = (User) event.getParameter(SFSEventParam.USER);
	IDBManager dbManager = getParentExtension().getParentZone().getDBManager();
        
        String Name = user.getName();
        String Query;
        ISFSArray Res;
        ISFSObject Data;
        try{
            Query = "SELECT * FROM user WHERE name=?";
            Res = dbManager.executeQuery(Query, new Object[] {Name});
            Data = Res.getSFSObject(0);
            ArrayList<UserVariable> myvars = new ArrayList<>();
            myvars.add(new SFSUserVariable("WearType", Data.getInt("wear_type")));
            myvars.add(new SFSUserVariable("Skin", Data.getInt("skin")));
            getApi().setUserVariables(user, myvars);
        }
        catch(SQLException e){
            trace(ExtensionLogLevel.WARN, "SQL Error: " + e.toString());
        }
    }
}
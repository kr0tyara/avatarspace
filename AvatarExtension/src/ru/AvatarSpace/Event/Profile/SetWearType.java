package ru.AvatarSpace.Event.Profile;

import java.sql.SQLException;
import com.smartfoxserver.v2.db.*;
import com.smartfoxserver.v2.entities.*;
import com.smartfoxserver.v2.entities.data.*;
import com.smartfoxserver.v2.entities.variables.SFSUserVariable;
import com.smartfoxserver.v2.entities.variables.UserVariable;
import com.smartfoxserver.v2.extensions.*;
import java.util.ArrayList;

public class SetWearType extends BaseClientRequestHandler {
    @Override
    public void handleClientRequest(User user, ISFSObject params) {
	IDBManager dbManager = getParentExtension().getParentZone().getDBManager();
        String User = user.getName();
        String Query;
        try{
            Query = "UPDATE user SET wear_type = IF(wear_type=0, 1, 0) WHERE name=?;";
            dbManager.executeUpdate(Query, new Object[] {User});
            
            ArrayList<UserVariable> myvars = new ArrayList<>();
            myvars.add(new SFSUserVariable("WearType", (user.getVariable("WearType").getIntValue() == 1 ? 0 : 1)));
            getApi().setUserVariables(user, myvars);
        }
        catch(SQLException e){
            trace(ExtensionLogLevel.WARN, "SQL Error: " + e.toString());
        }
    }
}

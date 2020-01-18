package ru.AvatarSpace.Event;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.smartfoxserver.v2.core.*;

import com.smartfoxserver.bitswarm.sessions.*;
import com.smartfoxserver.v2.db.*;
import com.smartfoxserver.v2.entities.data.*;
import com.smartfoxserver.v2.entities.variables.SFSUserVariable;
import com.smartfoxserver.v2.entities.variables.UserVariable;
import com.smartfoxserver.v2.exceptions.*;
import com.smartfoxserver.v2.extensions.*;
import com.smartfoxserver.v2.security.DefaultPermissionProfile;
import java.util.ArrayList;

public class Login extends BaseServerEventHandler{
    @Override
    public void handleServerEvent(ISFSEvent event) throws SFSException {        
        String userName = (String) event.getParameter(SFSEventParam.LOGIN_NAME);
        String cryptedPass = (String) event.getParameter(SFSEventParam.LOGIN_PASSWORD);
        ISession session = (ISession) event.getParameter(SFSEventParam.SESSION);
        
	IDBManager dbManager = getParentExtension().getParentZone().getDBManager();
	Connection connection;
        
        try {
            connection = dbManager.getConnection();
            PreparedStatement stmt = connection.prepareStatement("SELECT * FROM user where name='"+userName+"'");
            ResultSet res = stmt.executeQuery();
            
            if(res.first()) {
                String dbPword = res.getString("token");
                if (!getApi().checkSecurePassword(session, dbPword, cryptedPass)){
                    SFSErrorData data = new SFSErrorData(SFSErrorCode.LOGIN_BAD_PASSWORD);
                    throw new SFSLoginException("Неверный токен.", data);
                }

                switch(res.getInt("permission")){
                    default:
                        session.setProperty("$permission", DefaultPermissionProfile.STANDARD);
                        break;
                    case 1:
                        session.setProperty("$permission", DefaultPermissionProfile.MODERATOR);
                        break;
                    case 2:
                        session.setProperty("$permission", DefaultPermissionProfile.ADMINISTRATOR);
                        break;
                }

                ISFSObject outData = (ISFSObject) event.getParameter(SFSEventParam.LOGIN_OUT_DATA);
                outData.putUtfString(SFSConstants.NEW_LOGIN_NAME, res.getString("name"));
            }
            else {
                SFSErrorData errData = new SFSErrorData(SFSErrorCode.GENERIC_ERROR);
                throw new SFSLoginException("Пользователя не существует.", errData);
            }
        }
        catch (SQLException e){
            SFSErrorData errData = new SFSErrorData(SFSErrorCode.GENERIC_ERROR);
            throw new SFSLoginException("Произошла ошибка запроса: " + e.getMessage(), errData);
        }
    }
}

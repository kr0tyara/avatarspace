package ru.AvatarSpace.Event;

import com.smartfoxserver.v2.core.*;
import com.smartfoxserver.v2.exceptions.*;
import com.smartfoxserver.v2.extensions.*;
import com.smartfoxserver.v2.entities.*;
import com.smartfoxserver.v2.entities.data.*;
import com.smartfoxserver.v2.entities.variables.SFSUserVariable;
import com.smartfoxserver.v2.entities.variables.UserVariable;
import java.util.*;

public class Upd extends BaseServerEventHandler{
    @Override
    public void handleServerEvent(ISFSEvent event) throws SFSException {
        User user = (User) event.getParameter(SFSEventParam.USER);
        List<UserVariable> vars = (List<UserVariable>) event.getParameter(SFSEventParam.VARIABLES);
        if(vars.get(0).getName() == "x") {
            Double x = Math.floor(new Double(vars.get(0).getValue().toString()));
            Double y = Math.floor(new Double(vars.get(1).getValue().toString()));
            if(x < 0 || y < 0 || x > 1000 || y > 650) {
                ArrayList<UserVariable> myvars = new ArrayList<>();
                myvars.add(new SFSUserVariable("x", 500));
                myvars.add(new SFSUserVariable("y", 325));
                getApi().setUserVariables(user, myvars);
                return;
            }
        }
    }
}
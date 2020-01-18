package ru.AvatarSpace.Event;

import com.smartfoxserver.v2.core.*;
import com.smartfoxserver.v2.exceptions.*;
import com.smartfoxserver.v2.extensions.*;
import com.smartfoxserver.v2.entities.*;

public class JoinRoom extends BaseServerEventHandler{
    @Override
    public void handleServerEvent(ISFSEvent event) throws SFSException {
        User user = (User) event.getParameter(SFSEventParam.USER);
        String Name = user.getName();
    }
}
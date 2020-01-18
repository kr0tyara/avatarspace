package ru.AvatarSpace.Event;

import com.smartfoxserver.v2.core.*;
import com.smartfoxserver.v2.exceptions.*;
import com.smartfoxserver.v2.extensions.*;
import com.smartfoxserver.v2.entities.*;
import com.smartfoxserver.v2.entities.data.*;

public class Msg extends BaseServerEventHandler{
    @Override
    public void handleServerEvent(ISFSEvent event) throws SFSException {
        String message = (String) event.getParameter(SFSEventParam.MESSAGE);
        Room room = (Room) event.getParameter(SFSEventParam.ROOM);
        User sender = (User) event.getParameter(SFSEventParam.USER);
        if(message.length() > 50) {
            getApi().sendPublicMessage(room, sender, "Даня Курочкин - крутой! Политик, лидер, с бородой!", new SFSObject());
            return;
        }
    }
}
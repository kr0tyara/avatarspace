package ru.AvatarSpace.Server;

import com.smartfoxserver.v2.core.SFSEventType;
import com.smartfoxserver.v2.extensions.SFSExtension;

public class Events extends SFSExtension{
    @Override
    public void init(){
	addEventHandler(SFSEventType.USER_LOGIN, ru.AvatarSpace.Event.Login.class);
	addEventHandler(SFSEventType.PUBLIC_MESSAGE, ru.AvatarSpace.Event.Msg.class);
	addEventHandler(SFSEventType.USER_VARIABLES_UPDATE, ru.AvatarSpace.Event.Upd.class);
        addEventHandler(SFSEventType.USER_JOIN_ROOM, ru.AvatarSpace.Event.JoinRoom.class);
        addEventHandler(SFSEventType.USER_JOIN_ZONE, ru.AvatarSpace.Event.JoinZone.class);
        addRequestHandler("Profile.SetWearType", ru.AvatarSpace.Event.Profile.SetWearType.class);
        addRequestHandler("Profile.SetSkin", ru.AvatarSpace.Event.Profile.SetSkin.class);
    }
    @Override
    public void destroy() {
	super.destroy();
    }
}
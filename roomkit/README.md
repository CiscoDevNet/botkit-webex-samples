# MyRoomKit

The bot is an extension of a RoomKit device, giving you quick access to configuration, settings and commands.

To configure the bot, pass the environment variables below on the command line, or update the .env file with:
- JSXAPI_DEVICE_URL=ssh://10.10.1.52
- JSXAPI_USERNAME=integrator
- JSXAPI_PASSWORD=integrator

Then, start your bot, and type `peoplecount` to see the number of faces detected.


## Restricting access

Yu may want to restrict access to the skills that change the state of the device, or modify the bot configuration. 
To restrict access, use the following environment variables:
- RESTRICTED_SPACE : bot responds only from this space (unless the user asking is granted)
- GRANTED_EMAIL=ststartz@cisco.com: authorize this user to access the skills from any space


## TODO

Add a `standby` command, to see current status, and activate or deactivate the device

Add a `call` command, to initiate a call from the device

Add a `configure` conversation, to change the device URL, username, password

Add an `info` command to see the current device's name: system unit, device URL, user connected

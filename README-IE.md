# Configure testing in internet explorer

install [virtualbox](https://www.virtualbox.org/wiki/Downloads)

download the relevant IE testing vm for vitualbox from [here](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/)

Once the vm is installed and running you need to find your **host** machine IP address on the virtualbox network, use that ip address when running the following commands on your **guest** machine. On OSX run `ifconfig` from your **host** and look for an IP address under a network named something like `vboxnet0`. 

Then run these commands on your **guest** machine.
```
netsh interface portproxy add v4tov4 listenport=8000 listenaddress=127.0.0.1 connectport=8000 connectaddress=<host ip>
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=127.0.0.1 connectport=3001 connectaddress=<host ip>
```

You should be able to connect to `http://localhost:3001` on the guest VM.

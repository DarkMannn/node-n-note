# Node N Note

Note taking app for a terminal written in Node.js.
When you install it, it will be available as `nnn` binary.

Just run:
```bash
    nnn --help
```
This will print out the following:
```bash
    Usage: nnn read/write [options]

    Options:
      -h, --help       output usage information

    Commands:
      read [options]   Read a journal entry, daily retrospection notes or classic notes based on arguments and filtering
                       One of -j/-d/-n flags is mandatory
      write [options]  Write a journal entry, daily retrospection notes or a basic note

                Examples:
                $ nnn write -j               (write a journal entry)
                $ nnn write -d               (same but for daily retrospection note)
                $ nnn write -n               (same but only a classic note)
                $ nnn read -j                (read last 10 (default) journal entries)
                $ nnn read -d -l 5           (read last 5 daily retrospection entries)
                $ nnn read -n -a shopping    (read classin note entries with the 'shopping' tag)

```
This is a custom note app made to serve my needs.

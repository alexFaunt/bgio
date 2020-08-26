
HELLO THERE


* Objection GraphQL
  * Have taken a copy because they don't maintain it and i wanted some updates and CBA with a fork for 4 files
  * The lists suck - can't add totalCount / pageInfo
  * Can't seem to add my own resolvers? Seems like a big limitation - perhaps the virtual fields can help but dno seems like that's just another objection thing. Not even sure if it will play nicely with federation as we don't declare the types.
  * BUT i can build fast with it so :shrug: next time.


* Deno can't resolve paths? I didn't try very hard but it doesn't look like it
  * ts-node-dev is garbage, so went back to babel-watch
  * It's SO GOD DAMN SLOW. is it docker babel or node?

TODO next up is auth middleware on koa + pull out info into both servers

Also the models / migrations for users/pets need deleting obvs

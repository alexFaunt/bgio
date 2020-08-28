
HELLO THERE


* Objection GraphQL
  * Have taken a copy because they don't maintain it and i wanted some updates and CBA with a fork for 4 files
  * Can't seem to add my own resolvers? Seems like a big limitation - perhaps the virtual fields can help but dno seems like that's just another objection thing. Not even sure if it will play nicely with federation as we don't declare the types.
  * BUT i can build fast with it so :shrug: next time.
  * Tried to adapt this to work with pagination https://github.com/Vincit/objection-graphql/pull/80/files - but it's only for top level, i got half way to crowbarring it in, but it didn't really work and was spaghetti central. It ended up not using eager at all and requesting way too much without even narrowing down by id
  * I Think tbh i'd just start from scratch parsing the tree and flattening out the paginated things before starting / but still doesn't help for totalCount
  * total count might be something like this https://vincit.github.io/objection.js/recipes/relation-subqueries.html#relation-subqueries

* Deno can't resolve paths? I didn't try very hard but it doesn't look like it
  * ts-node-dev is garbage, so went back to babel-watch
  * it doesn't work well with babel 7 but ok for now


TODO next up is auth middleware on koa + pull out info into both servers

Also the models / migrations for users/pets need deleting obvs
Also need a model for any BGIO stuff we want to expose

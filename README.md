
HELLO THERE

* Barely works
TODO:
* Make cards actually readable and not shit.
* Static asset caching and bundle opt
* DNS hostname
* maybe re-host it on something not shit to do no downtime deploys
* Block requests i don't want you to do
* See if we can stop cheating by reading hands / debug
* AUTH - both shit and good


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

* BGIO
  * The credentials that come with player objects don't do anything which is super dumb, just passing em around for no reason. Even the generateAuth functions etc don't seeeeem to do anything? might have to write own transport
  * ALSO if you just turn debug on you can flick between players anyway lol
  * Proxying is ridiculous but whatever


* Cards
https://www.me.uk/cards/makeadeck.cgi

* poker
https://github.com/goldfire/pokersolver


TODO
"react-hooks" eslint
* Move auth to middleware - if no user generate one (except maybe home page which is for SEO / rules / big LETS GO button). Make everything in cookies
* Un auth all pages + let that middleware handle it
* design game page + sort out theme + components to not be shit
* design games page + sending link stuff

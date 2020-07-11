function InMemoryStore() {
  const data = {};

  function save(id, data) {}

  function get(id) {}

  function remove(id) {}

  return {
    get,
    remove,
    save,
  };
}

module.exports = InMemoryStore;

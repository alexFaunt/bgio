const userResolver = {
  resolvedField: () => 'hi', // Custom additional field
  name: () => null, // Restricted privacy field
};

export default userResolver;

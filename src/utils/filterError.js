const filterError = (error) => {
  let nestedError = error?.split(/\n|\ "/)?.map((e) => e?.trim()?.replaceAll('"', "")?.trim());

  const formattedError = nestedError?.filter((e) => {
    return !e?.includes("backend\\node_modules");
  });
  return formattedError?.map((e) => e?.trim()); // Array format
  // return { ...formattedError?.map((e) => e?.trim()) }; // Object format
};
module.exports = filterError;

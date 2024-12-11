export default async function getCompilerVersion() {
  try {
    const response = await fetch(
      "https://binaries.soliditylang.org/bin/list.json"
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}

import reader from "xlsx";

async function readExcelFile(fileName, sheetName, readAll = false) {
  try {
    const file = reader.readFile(fileName);

    let data = [];

    const sheets = file.SheetNames;

    if (readAll) {
      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]]
        );
        temp.forEach((res) => {
          data.push(res);
        });
      }

      return data;
    }

    const temp = reader.utils.sheet_to_json(file.Sheets[sheetName]);

    temp.forEach((res) => {
      data.push(res);
    });

    return data;
  } catch (err) {
    console.log("The error: ", err);
  }
}

async function writeExcelFile(fileName, sheetName, data) {
  try {
    // const file = reader.readFile(fileName);
    const workbook = reader.utils.book_new();
    const ws = reader.utils.json_to_sheet(data);
    reader.utils.book_append_sheet(workbook, ws, sheetName);
    reader.writeFile(workbook, fileName);
  } catch (err) {
    console.log("The error: ", err);
  }
}

export { readExcelFile, writeExcelFile };


function SelectCity() {
  return (
    <div className="select-city">
      <h2>都道府県</h2>
      <select>
        
      </select>
    </div>
  );
}

export default SelectCity;

// function selectCity() {
//   const url =
//     'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures';

//     const promise = fetch(url);
//     promise
//     .then(response => response.json())
//     .then(jsondata => {
//       showResult("result: "+ JSON.stringify(jsondata));
//     });

// }

async functiuon selectCity() {
  const url =
    "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures";
    try {
      const response =await fetch(url);
      if (!response.ok) {
        throw new Error(`response.status = ${response.status}, response.statusText = ${response.statusText}`);
      }

      const jsondata = await response.json();
      showResult("result :" + JSON.stringify(jsondata));
    }
    catch (err) {
      showResult("err: " + err);
    }
}
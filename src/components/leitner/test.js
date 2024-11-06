const url = `https://raw.githubusercontent.com/learnuidev/myelin/refs/heads/main/src/components/leitner/leitner.js`;

fetch(url)
  .then((resp) => resp.text())
  .then((val) => {
    console.log("val", val);
  });

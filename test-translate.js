const translate = async (text, tl) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(x => x[0]).join('');
  } catch(e) {
    return text;
  }
};

translate("Hello, how are you today?", "hi").then(console.log);
translate("Govt. Schemes Directory", "mr").then(console.log);

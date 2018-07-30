class API {
  post(path, data) {
    return fetch(`casals://${path}`, {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then((res)=> res.json());
  }
}

export default new API();

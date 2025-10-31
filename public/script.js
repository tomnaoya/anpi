function showContactForm() {
  document.getElementById("content").innerHTML = `
    <h3>緊急連絡先登録</h3>
    <form method="POST" action="/user/update-contact">
      電話番号：<input name="contact_phone"><br>
      メール：<input name="contact_email"><br>
      <button type="submit">登録</button>
    </form>`;
}

function showReportForm() {
  document.getElementById("content").innerHTML = `
    <h3>安否報告フォーム</h3>
    <form method="POST" action="/user/report">
      災害名：<input name="disaster"><br>
      状況：
      <select name="status">
        <option>無事</option>
        <option>けが</option>
        <option>行方不明</option>
      </select><br>
      コメント：<input name="comment"><br>
      <button type="submit">報告</button>
    </form>`;
}

function showAdminMenu() {
  fetch("/admin/contacts")
    .then((res) => res.json())
    .then((data) => {
      const html = data.map(
        (u) => `<tr><td>${u.name}</td><td>${u.contact_phone}</td><td>${u.contact_email}</td></tr>`
      ).join("");
      document.getElementById("content").innerHTML = `
        <h3>全員の緊急連絡先</h3>
        <table border="1"><tr><th>氏名</th><th>電話</th><th>メール</th></tr>${html}</table>`;
    });
}

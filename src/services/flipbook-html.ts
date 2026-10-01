import {LibraryBook} from '../types/book';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createPage(book: LibraryBook, pageNumber: number) {
  const chapter = book.tableOfContents.find(entry => entry.page === pageNumber);
  const isCover = pageNumber === 1;
  const title = isCover ? book.title : chapter?.title ?? `Trang ${pageNumber}`;
  const body = isCover
    ? book.description
    : chapter
      ? `Bắt đầu phần “${chapter.title}”. Nội dung trang sẽ được thay bằng Page Asset từ Liferay hoặc pipeline PDF khi nguồn tài liệu được tích hợp.`
      : `Nội dung minh họa cho trang ${pageNumber}. Trình đọc hiện đã sẵn sàng nhận ảnh trang thực tế từ dịch vụ tài liệu.`;
  return `
    <article class="page" data-density="${isCover ? 'hard' : 'soft'}">
      <div class="paper ${isCover ? 'cover-page' : ''}" style="--accent:${escapeHtml(book.coverColor)}">
        <div class="page-kicker">${isCover ? escapeHtml(book.category) : escapeHtml(book.title)}</div>
        <div class="page-content">
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(body)}</p>
          ${isCover ? `<div class="author">${escapeHtml(book.author)}</div>` : ''}
        </div>
        <div class="page-footer"><span>MEKOREADER</span><span>${pageNumber}</span></div>
      </div>
    </article>`;
}

export function createFlipbookHtml(book: LibraryBook) {
  const pages = Array.from({length: book.totalPages}, (_, index) => createPage(book, index + 1)).join('');
  const startPage = Math.max(0, Math.min(book.currentPage > 0 ? book.currentPage - 1 : 0, book.totalPages - 1));
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <style>
    *{box-sizing:border-box} html,body{height:100%;margin:0;overflow:hidden;background:#152237;font-family:Arial,sans-serif}
    body{display:flex;align-items:center;justify-content:center;padding:18px}.book-shell{height:100%;width:100%;display:flex;align-items:center;justify-content:center}
    #book{margin:auto}.page{background:#f7f0df;color:#243047;overflow:hidden}.paper{height:100%;padding:28px 25px 20px;display:flex;flex-direction:column;background:linear-gradient(90deg,rgba(0,0,0,.07),transparent 8%),#fffdf7;border:1px solid rgba(22,34,55,.1)}
    .cover-page{color:#fff;background:linear-gradient(145deg,var(--accent),#14243b)}.page-kicker{font-size:10px;font-weight:800;letter-spacing:1.2px;opacity:.7;text-transform:uppercase}.page-content{display:flex;flex:1;flex-direction:column;justify-content:center}
    h1{font-size:25px;line-height:1.18;margin:0 0 18px}p{font-family:Georgia,serif;font-size:14px;line-height:1.65;margin:0;opacity:.86}.author{font-size:12px;font-weight:700;margin-top:24px;opacity:.8}
    .page-footer{display:flex;font-size:9px;font-weight:700;justify-content:space-between;letter-spacing:.8px;opacity:.5}.loading{color:#d9e4f1;font-size:13px;text-align:center}.error{color:#ffd7d7;max-width:320px;text-align:center;line-height:1.5}
  </style>
</head>
<body>
  <div class="book-shell"><div id="book">${pages}</div></div>
  <script src="https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js" onerror="showError('Không tải được StPageFlip. Hãy kiểm tra kết nối mạng.')"></script>
  <script>
    const totalPages=${book.totalPages};
    function send(payload){
      const value=JSON.stringify(payload);
      if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(value)}
      if(window.parent&&window.parent!==window){window.parent.postMessage(value,'*')}
    }
    function showError(message){document.body.innerHTML='<div class="error">'+message+'</div>';send({type:'error',message})}
    window.addEventListener('load',()=>{
      try{
        if(!window.St||!window.St.PageFlip){showError('StPageFlip chưa sẵn sàng.');return}
        window.flipbook=new window.St.PageFlip(document.getElementById('book'),{width:360,height:520,size:'stretch',minWidth:260,maxWidth:720,minHeight:360,maxHeight:1040,maxShadowOpacity:.55,showCover:true,mobileScrollSupport:false,usePortrait:true,flippingTime:700});
        window.flipbook.loadFromHTML(document.querySelectorAll('.page'));
        window.flipbook.turnToPage(${startPage});
        window.flipbook.on('flip',event=>send({type:'pageChanged',page:event.data+1,totalPages}));
        send({type:'ready',page:${startPage + 1},totalPages});
      }catch(error){showError('Không thể khởi tạo Flipbook: '+String(error))}
    });
  </script>
</body>
</html>`;
}

### 网易前端微专业大作业  
提交记录：  
1. ‘The first commit’：第一次的提交；  
2. ‘Change the path to sprite.png’: 之前的路径为./source/sprite.png改成../source/sprite.png；  
3. ‘Renamed to index.html’: 将layout.html改成了index.html，因为gh-page默认只读取index.html;  
4. 'fix bugs of iframe and cookies': iframe的domain未设置，导致获取iframe的内容时会出现跨域的提示；getCookie方法当cookie为空时返回的是空对象，本意是想返回false；  
5. ‘optimize the network’：将所有的图片都上传到七牛云，用外链的方式引入图片；增加readme.md;
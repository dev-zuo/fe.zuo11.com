# npm run dev退出后依旧占用端口

vscode ctrl+c结束后端口仍然占用的问题.md
使用非vscode的控制台即可。

npm run dev退出后依旧占用端口，

https://www.cnblogs.com/fqh123/p/11379941.html

mac 查看端口占用情况
lsof -i :7000
sudo kill -9 716
-9后面加一个空格，然后加上占用端口的进程PID，就可以杀掉占用端口的进程。最后重启就ok。
Mac 查看端口占用情况及杀死进程
https://www.jianshu.com/p/9216b6127a82

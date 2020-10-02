# Docker

## Docker安装
### mac本地安装
到官方下载 dmg 安装包安装即可，安装完成后，命令行输入 docker 测试是否安装成功
### ubuntu服务器安装
```bash
ssh root@xx.xx.xx.xx    # root 用户
ssh unbuntu@xx.xx.xx.xx # 需要 sudo
# apt升级
sudo apt-get update
# 添加相关软件包
sudo apt-get install \
apt-transport-https \
ca-certificates \
curl \
software-properties-common
# 下载软件包的合法性，需要添加软件源的 GPG 密钥
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
# source.list 中添加 Docker 软件源
sudo add-apt-repository \
"deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu \
$(lsb_release -cs) \
stable"
# 安装 Docker CE
sudo apt-get update
sudo apt-get install docker-ce
# 启动 Docker CE
sudo systemctl enable docker  # 添加docker服务
sudo systemctl start docker # 启动docker
# 建立 docker 用户组(附加) 
sudo groupadd docker
sudo usermod -aG docker $USER
# Helloworld测试
docker run hello-world
```

### 镜像加速
- 阿里云加速器(需登录账号获取)
- Azure 中国镜像 https://dockerhub.azk8s.cn
- 七牛云加速器 https://reg-mirror.qiniu.com

```bash
#  sudo vi /etc/docker/daemon.json 
{ 
  "registry-mirrors": [ 
    "https://dockerhub.azk8s.cn",
    "https://reg-mirror.qiniu.com" 
  ] 
}
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 简单Nginx服务
```bash
# 拉取官方镜像 - 面向docker的只读模板
docker pull nginx   # 可能会等很久，下载慢
# 查看
docker images nginx
# 启动镜像
mkdir www
echo 'hello docker!!' >> www/index.html
# 启动
# www目录里面放一个index.html
# -p 端口映射 8000:80 ，将服务器的8000端口，映射到docker虚拟机里nginx服务的80端口
# $PWD/www 当前目录下的www，: 映射到 nginx 默认的路径下，使用镜像名字为 nginx
docker run -p 8000:80 -v $PWD/www:/usr/share/nginx/html nginx  
# 后台启动
# -d 以 daemon 后台守护进程执行，返回 uuid
docker run -p 80:80 -v $PWD/www:/usr/share/nginx/html -d nginx 
# 停止
# docker ps 查询进程
# docker ps
# docker ps -a # 查看全部，容器id的前3即可 docker start ff6
docker stop ff6
# 查看进程

# 伪终端 ff6容器的uuid，进入docker内部伪终端
docker exec -it ff6 /bin/bash
# 删除镜像
docker rm ff6
```
FROM jenkins/inbound-agent

USER root

COPY entrypoint.sh /entrypoint.sh
RUN chown jenkins:jenkins /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN apt update
RUN apt install -y ca-certificates curl gnupg unzip

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" > /etc/apt/sources.list.d/docker.list
RUN apt update
RUN apt install -y docker-ce-cli

# 아래 <arch> 의 자리에는 amd64, arm64 등 적절한 것을 기재해야 함 (두 군데)
ADD https://releases.hashicorp.com/terraform/1.6.6/terraform_1.6.6_linux_arm64.zip .
RUN unzip terraform_1.6.6_linux_arm64.zip
RUN mv terraform /bin && chmod +x /bin/terraform

USER jenkins

ENTRYPOINT ["/entrypoint.sh"]

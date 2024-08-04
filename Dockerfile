FROM bitnami/minideb:latest

ENV BUN_INSTALL="$HOME/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

WORKDIR /app

RUN install_packages curl ca-certificates unzip \
	&& curl -fsSL https://bun.sh/install | bash

COPY . .

RUN bun install

CMD ["bun", "dev"]

FROM node:24.17.0 AS build

ARG VITE_FIREBASE_WEB_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_TEMP_NUMBER_BACKEND_API_BASE_PATH
ARG VITE_TELEGRAM_BOT_ID
ARG VITE_RECAPTCHA_ENTERPRISE_ENABLED
ARG VITE_RECAPTCHA_ENTERPRISE_SITE_KEY
ARG VITE_WL_RECAPTCHA_ENTERPRISE_SITE_KEY
ARG VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL
ARG VITE_TEMP_NUMBER_WEB_ENABLED_PAYMENT_GATEWAYS
ARG VITE_MOBILE_PAYMENT_GATEWAYS
ARG VITE_WL_API_BASE_PATH
ARG VITE_WL_PAYMENT_GATEWAYS
ARG VITE_CDN_BASE_URL
ARG VITE_ALIPAY_QQ_WECHAT_STORE_URL
ARG VITE_WL_ALIPAY_QQ_WECHAT_STORE_URL
ARG VITE_WL_RECAPTCHA_ENTERPRISE_SITE_KEY
ARG VITE_CRISP_WEBSITE_ID
ARG VITE_CSP_ENABLED
ARG VITE_ACTIVE_OTHER_PAY_GATEWAYS
ARG VITE_WL_ACTIVE_OTHER_PAY_GATEWAYS

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npx update-browserslist-db@latest && npm install
COPY . .
RUN npm run build

USER node
CMD ["npm", "start"]

FROM nginx:alpine
EXPOSE 8080
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY --from=build /usr/src/app/dist/ ./app

# Run as the unprivileged "nginx" user shipped with the base image. The pid file
# is relocated to a user-writable path (see nginx.conf) and the served content
# is made owned by that user.
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx
USER nginx

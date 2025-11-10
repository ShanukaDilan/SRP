FROM php:8.3-apache

# PHP extensions
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
 && docker-php-ext-configure intl \
 && docker-php-ext-install intl pdo pdo_mysql zip bcmath gd \
 && rm -rf /var/lib/apt/lists/*

# Apache modules + Laravel docroot
RUN a2enmod rewrite headers
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!DocumentRoot /var/www/html!DocumentRoot ${APACHE_DOCUMENT_ROOT}!' /etc/apache2/sites-available/000-default.conf \
 && sed -ri 's!<Directory /var/www/>!<Directory ${APACHE_DOCUMENT_ROOT}>!' /etc/apache2/apache2.conf \
 && sed -ri 's!AllowOverride None!AllowOverride All!' /etc/apache2/apache2.conf

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

#open apache  http-vhosts.conf and add the virtual hosts. please, modify ur project directory

<VirtualHost *:80>
  ServerName baloo-api.dev
  DocumentRoot "C:\wamp64\www\Github\Baloo\Baloo.Api\public"
  ServerAlias baloo-api.dev
    <Directory  "C:\wamp64\www\Github\Baloo\Baloo.Api">
    Options +Indexes +Includes +FollowSymLinks +MultiViews
    AllowOverride All
    Require local
  </Directory>
</VirtualHost>

<VirtualHost *:80>
  ServerName baloo.dev
  DocumentRoot "C:\wamp64\www\Github\Baloo\Vendor.App"
  ServerAlias baloo.dev
    <Directory  "C:\wamp64\www\Github\Baloo\Vendor.App">
    Options +Indexes +Includes +FollowSymLinks +MultiViews
    AllowOverride All
    Require local
  </Directory>
</VirtualHost>

#open C:\Windows\System32\drivers\etc , add these records to hosts files, u may need administrative privileges for modifications

127.0.0.1 baloo-api.dev
127.0.0.1 baloo.dev

#composer install

#create and fix database name & credentials in .env

#php artisan migrate

# init passport + keys
#php artisan passport:install

# php artisan key:generate

#php artisan storage:link

#php artisan config:cache

php artisan config:clear //optional
php artisan cache:clear //optional
php artisan migrate
php artisan key:generate

# create grant password client
#php artisan passport:client --password
#from cmd copy the Id and Client secret to Vendor.api/enviroment.js

# seed roles and users, clients
php artisan db:seed

#reload
composer dump-autoload


#COMMANDS TO BE CONSIDERED
#npm install -g gulp bower
#npm install
#bower install
# Watching assets
#gulp && gulp watch
#php artisan serve

#api-response : https://github.com/songshenzong/api
#api-response : https://github.com/dees040/laravel-api-responses
#fractal : https://github.com/spatie/laravel-fractal
#zizaco/entrust :
#barryvdh/laravel-cors :

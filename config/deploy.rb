set :application, "rtor"
set :repository,  "git@github.com:gaving/rtor.git"
set :scm, :git

set :branch, "master"
set :deploy_via, :remote_cache
set :runner, "gavin"

set :deploy_to, "/var/www/#{application}"

ssh_options[:port] = 40

server "192.168.1.100", :app, :web, :db, :primary => true

namespace :deploy do
    task :copy_config do
        system "scp -P 40 config/config.yml gavin@192.168.1.100:#{shared_path}/"
        run  "ln -nfs #{shared_path}/config.yml #{release_path}/config/config.yml"
    end
end

after 'deploy:update_code', 'deploy:copy_config'

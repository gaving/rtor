# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
    helper :all # include all helpers, all the time

    # See ActionController::RequestForgeryProtection for details
    # Uncomment the :secret if you're not using the cookie session store
    #protect_from_forgery # :secret => '63cd8a0aa66002c59918243e0661a9e7'

    # See ActionController::Base for details 
    # Uncomment this to filter the contents of submitted sensitive data parameters
    # from your application log (in this case, all fields with names like "password"). 
    # filter_parameter_logging :password

    APP_CONFIG = YAML.load_file("#{RAILS_ROOT}/config/config.yml")[RAILS_ENV]

    def help
        Helper.instance
    end

    class Helper
        include Singleton
        include ActionView::Helpers::TextHelper
        include ActionView::Helpers::NumberHelper
    end

    def server_call(*args)
        s = XMLRPC::Client.new2(APP_CONFIG['rtorrent_scgi'])
        s.call(*args)
    end

    def call_wrapper(cmd, hash)
        begin
            server_call(cmd, hash)
            resp = true
        rescue XMLRPC::FaultException
            resp = false
        end

        return resp
    end

end

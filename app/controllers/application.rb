# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
require 'ruby-growl'

class ApplicationController < ActionController::Base
    helper :all # include all helpers, all the time

    # See ActionController::RequestForgeryProtection for details
    # Uncomment the :secret if you're not using the cookie session store
    protect_from_forgery # :secret => '63cd8a0aa66002c59918243e0661a9e7'

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
        s = XMLRPC::Client.new2(APP_CONFIG['rtorret_scgi'])
        s.call(*args)
    end

    def call_wrapper(cmd, hash)
        begin
            server_call(cmd, hash)
            resp = 1
        rescue XMLRPC::FaultException
            resp = 0
        end

        return resp
    end

    def do_growl(subject, body)
        g = Growl.new "localhost", "rtor", ["rtor Notification"]
        g.notify "rtor Notification", subject, body
    end

    def get_file_list()
        begin
            return Dir.new(APP_CONFIG['download_directory']).entries.sort.reject {|f| [".", ".."].include? f}[0,5]
        rescue Errno::ENOENT
            return []
        end
    end

    def file_type(file_name)
        File.extname(file_name).gsub( /^\./, '' ).downcase
    end

    def get_mime_icon(file)
        case file_type(file)
        when 'avi', 'mkv'
            return 'mime-video'
        when 'jpg'
            return 'mime-image'
        when 'mp3'
            return 'mime-audio'
        when 'rar'
            return 'mime-archive'
        when 'txt'
            return 'mime-text'
        when nil
            return 'mime-folder'
        else
            return 'mime-unknown'
        end
    end

    def get_ratio_icon(ratio)
        ratio = Float(ratio)
        if ratio >= 0.90
            return 'face-grin'
        elsif ratio >= 0.75
            return 'face-smile-big'
        elsif ratio >= 0.60
            return 'face-smile'
        elsif ratio >= 0.50
            return 'face-plain'
        elsif ratio >= 0.30
            return 'face-sad'
        else
            return 'face-crying'
        end
    end

end

require 'xmlrpc/client'

class IndexController < ApplicationController

    def files
        @folders = get_file_list()
        render :text => @folders.to_json
    end

end

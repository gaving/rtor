require 'xmlrpc/client'

class IndexController < ApplicationController

    def add
        render :partial => "add"
    end

    def files
        @folders = get_file_list()
        render :text => @folders.to_json
    end

end

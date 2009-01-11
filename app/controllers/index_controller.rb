require 'xmlrpc/client'

class IndexController < ApplicationController

    def index

        @folders = get_file_list()

        @feed = Array.new

        entry = Hash.new
        entry[:name] = "Test entry"
        @feed << entry

        entry = Hash.new
        entry[:name] = "Roy entry"
        @feed << entry

        respond_to do |format|
            format.html
        end
    end

end

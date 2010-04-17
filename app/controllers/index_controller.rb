require 'xmlrpc/client'

class IndexController < ApplicationController

    def add
        render :partial => "add"
    end
end

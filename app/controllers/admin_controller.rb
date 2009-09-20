class AdminController < ApplicationController

    layout 'index'

    def index
        flash[:notice] = "Hello there"
    end
end

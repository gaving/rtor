require 'xmlrpc/client'

class TorrentController < ApplicationController

    def info
        print params[:id]

        respond_to do |format|
            format.html
        end
    end

    def erase
        @t = params[:id]
        render :text => Hash[ 'erased' => call_wrapper("d.erase", @t) ].to_json
    end

    def start
        @t = params[:id]
        render :text => Hash[ 'started' => call_wrapper("d.start", @t) ].to_json
    end

    def stop
        @t = params[:id]
        render :text => Hash[ 'stopped' => call_wrapper("d.stop", @t) ].to_json
    end


end

require 'cgi'

class TorrentController < ApplicationController

    def index
        @torrents = Torrent.all
        render :text => @torrents.to_json
    end

    def show
        @torrent = Torrent.find(params[:id])
        render :text => @torrent.name
    end

    def torrents
        @torrents = Torrent.all
        @torrents.each do |t|
            t.ratio_img = get_ratio_icon(t.ratio)
            t.mime_img = get_mime_icon(t.name)
        end
        render :text => @torrents.to_json
    end

    def info
        render :text => {
            :completed => Torrent.completed.size,
            :downloading => Torrent.downloading.size
        }.to_json
    end

    def add
        @t = params[:torrent]
        @t << '&sessu=' + CGI.escape(APP_CONFIG['cookie'])
        do_growl(sprintf("%s has been added!", @t))
        render :text => Hash[ 'added' => call_wrapper("load_start", @t) ].to_json
    end

    def erase
        @t = Torrent.find(params[:id])
        do_growl("has been deleted!", @t.name)
        render :text => Hash[ 'erased' => call_wrapper("d.erase", @t.hash) ].to_json
    end

    def start
        @t = Torrent.find(params[:id])
        do_growl("has been started!", @t.name)
        render :text => Hash[ 'started' => call_wrapper("d.start", @t.hash) ].to_json
    end

    def stop
        @t = Torrent.find(params[:id])
        do_growl("has been stopped!", @t.name)
        render :text => Hash[ 'stopped' => call_wrapper("d.stop", @t.hash) ].to_json
    end

    def open
        send_file('/Users/gavin/Downloads/12-1.jpg')
    end

end

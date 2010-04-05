require 'cgi'

class TorrentController < ApplicationController

    def add
        t = params[:torrent]
        t << '&sessu=' + CGI.escape(APP_CONFIG['cookie'])
        render :text => { 'added' => call_wrapper("load_start", t) }.to_json
    end

    def erase
        t = Torrent.find(params[:id])
        render :text => { 'erased' => call_wrapper("d.erase", t.hash) }.to_json
    end

    def info
        render :text => {
            :completed => Torrent.completed.size,
            :downloading => Torrent.downloading.size
        }.to_json
    end

    def open
        t = Torrent.find(params[:id])
        path = File.join(APP_CONFIG['access_directory'], CGI.escape(t.name))
        render :text => { 'path' => path }.to_json
    end

    def show
        torrent = Torrent.find(params[:id])
        render :text => torrent.name
    end

    def start
        t = Torrent.find(params[:id])
        render :text => { 'started' => call_wrapper("d.start", t.hash) }.to_json
    end

    def stop
        t = Torrent.find(params[:id])
        render :text => { 'stopped' => call_wrapper("d.stop", t.hash) }.to_json
    end

    def torrents
        torrents = Torrent.all
        torrents = torrents.sort_by { |torrent| torrent.remaining }.reverse
        render :text => torrents.to_json
    end

end

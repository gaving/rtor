require 'cgi'

class TorrentController < ApplicationController

    def index
        torrents = Torrent.all
    end

    def show
        torrent = Torrent.find(params[:id])
        render :text => torrent.name
    end

    def add
        t = params[:torrent]
        t << '&sessu=' + CGI.escape(APP_CONFIG['cookie'])
        do_growl(sprintf("%s has been added!", t))
        render :text => { 'added' => call_wrapper("load_start", t) }.to_json
    end

    def erase
        t = Torrent.find(params[:id])
        do_growl("has been deleted!", t.name)
        render :text => { 'erased' => call_wrapper("d.erase", t.hash) }.to_json
    end

    def info
        render :text => {
            :completed => Torrent.completed.size,
            :downloading => Torrent.downloading.size
        }.to_json
    end

    def open
        render :text => session[:tim]
        #t = Torrent.find(params[:id])
        #path = File.join(APP_CONFIG['download_directory'], t.name)
        #send_file(path)
    end

    def start
        t = Torrent.find(params[:id])
        render :text => { 'started' => call_wrapper("d.start", t.hash) }.to_json
    end

    def stop
        t = Torrent.find(params[:id])
        #do_growl("has been stopped!", t.name)
        render :text => { 'stopped' => call_wrapper("d.stop", t.hash) }.to_json
    end

    def check_for_updates(current_session)
        if !session[:stored_session].nil?
            stored_session = session[:stored_session]
            current_session.each do |key, value|
                t = Torrent.find(key)
                if stored_session.has_key?(key)
                    if (stored_session[key][:complete] == 0) and (value[:complete] == 1)
                        do_growl("has completed!", t.name)
                    end
                    if (stored_session[key][:state] == 1) and (value[:state] == 0)
                        do_growl("has been stopped!", t.name)
                    elsif (stored_session[key][:state] == 0) and (value[:state] == 1)
                        do_growl("has been started!", t.name)
                    end
                else
                    do_growl("has been added!", t.name)
                end
            end
        end
    end

    def torrents
        torrents = Torrent.all
        current_session = {}
        torrents.each do |t|
            t.ratio_img = get_ratio_icon(t.ratio)
            t.mime_img = get_mime_icon(t.name)
            current_session[t.hash] = {:complete => t.complete, :state => t.state}
        end
        check_for_updates(current_session)
        session[:stored_session] = current_session
        render :text => torrents.to_json
    end

end

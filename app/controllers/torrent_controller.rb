require 'xmlrpc/client'

class TorrentController < ApplicationController

    def torrents
        @torrents = Array.new

        completed = server_call("download_list")
        completed.each do |t|
            torrent = Hash.new
            torrent[:hash] = t
            torrent[:base_path] = server_call("d.get_base_path", t)
            torrent[:name] = server_call("d.get_base_filename", t)
            torrent[:uploaded] = server_call("d.get_up_total", t)
            torrent[:downloaded] = server_call("d.get_bytes_done", t)
            torrent[:size] = server_call("d.get_size_bytes", t)
            torrent[:state] = server_call("d.get_state", t)
            torrent[:down_rate] = server_call("d.get_down_rate", t)
            torrent[:up_rate] = server_call("d.get_up_rate", t)
            torrent[:remaining] = torrent[:size] - torrent[:downloaded]
            torrent[:percentage] = sprintf("%.2f", (Float(torrent[:downloaded]) / Float(torrent[:size]) * 100))
            torrent[:ratio] = sprintf("%.2f", Float(torrent[:uploaded]) / Float(torrent[:size]))
            torrent[:size] = help.number_to_human_size(torrent[:size])
            torrent[:uploaded] = help.number_to_human_size(torrent[:uploaded])
            torrent[:remaining] = help.number_to_human_size(torrent[:remaining])
            torrent[:downloaded] = help.number_to_human_size(torrent[:downloaded])
            torrent[:down_rate] = help.number_to_human_size(torrent[:down_rate])
            torrent[:up_rate] = help.number_to_human_size(torrent[:up_rate])
            torrent[:ratio] = torrent[:ratio]
            torrent[:ratio_img] = get_ratio_icon(torrent[:ratio])
            torrent[:mime_img] = get_mime_icon(torrent[:name])
            @torrents << torrent
        end

        render :text => @torrents.to_json
    end

    def info
        @torrents = Array.new
        completed = server_call("download_list")
        completed.each do |t|
            torrent = { :hash => t, :state => server_call('d.get_complete', t) }
            @torrents << torrent
        end
        completed = @torrents.select{|torrent|torrent[:state] == 1}
        downloading = @torrents.select{|torrent|torrent[:state] == 0}
        render :text => { :completed => completed.size, :downloading => downloading.size }.to_json
    end

    def erase
        @t = params[:id]
        do_growl("rtor", sprintf("%s has been deleted!", @t))
        render :text => Hash[ 'erased' => call_wrapper("d.erase", @t) ].to_json
    end

    def start
        @t = params[:id]
        do_growl("rtor", sprintf("%s has now been started!", @t))
        render :text => Hash[ 'started' => call_wrapper("d.start", @t) ].to_json
    end

    def stop
        @t = params[:id]
        do_growl("rtor", sprintf("%s is now stopped!", @t))
        render :text => Hash[ 'stopped' => call_wrapper("d.stop", @t) ].to_json
    end

end

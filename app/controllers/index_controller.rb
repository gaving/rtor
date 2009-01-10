require 'xmlrpc/client'

class IndexController < ApplicationController

    def index

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
            torrent[:percentage] = sprintf("%.2f", (Float(torrent[:downloaded]) / Float(torrent[:size]) * 100))
            torrent[:ratio] = sprintf("%.2f", Float(torrent[:uploaded]) / Float(torrent[:size]))
            @torrents << torrent
        end

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

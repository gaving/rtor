require 'xmlrpc/client'
require 'cgi'

APP_CONFIG = YAML.load_file("#{RAILS_ROOT}/config/config.yml")[RAILS_ENV]

def server_call(*args)
    s = XMLRPC::Client.new2(APP_CONFIG['rtorrent_scgi'])
    s.call(*args)
end

class Torrent

    attr_reader :hash
    attr_reader :base_path
    attr_reader :name
    attr_reader :downloaded
    attr_reader :size
    attr_reader :state
    attr_reader :complete
    attr_reader :down_rate
    attr_reader :up_rate
    attr_reader :remaining
    attr_reader :percentage
    attr_reader :ratio

    attr_accessor :ratio_img
    attr_accessor :mime_img

    def help
        Helper.instance
    end

    class Helper
        include Singleton
        include ActionView::Helpers::TextHelper
        include ActionView::Helpers::NumberHelper
    end

    def self.all
        begin
            completed = server_call("download_list", "main")
            completed.map { |t| new(t) }
        rescue SocketError, Errno::ECONNREFUSED => e
            print "Error: Could not connect to server '%s' (%s)\r\n" % [APP_CONFIG['rtorrent_scgi'], e]
            completed = {}
        end
    end

    def self.find(param)
        all.detect { |l| l.to_param == param } || raise(ActiveRecord::RecordNotFound)
    end

    def self.completed
        all.select{ |torrent| torrent.complete == 1 }
    end

    def self.downloading
        all.select{ |torrent| torrent.complete == 0 }
    end

    def initialize(hash)
        @hash = hash
        @base_path = server_call("d.get_base_path", hash)
        @name = server_call("d.get_base_filename", hash)
        @uploaded = server_call("d.get_up_total", hash)
        @downloaded = server_call("d.get_bytes_done", hash)
        @size = server_call("d.get_size_bytes", hash)
        @state = server_call("d.get_state", hash)
        @complete = server_call("d.get_complete", hash)
        @down_rate = server_call("d.get_down_rate", hash)
        @up_rate = server_call("d.get_up_rate", hash)
        @remaining = @size - @downloaded
        @percentage = sprintf("%.2f", (Float(@downloaded) / Float(@size) * 100))
        @ratio = sprintf("%.2f", Float(@uploaded) / Float(@size))
        @size = help.number_to_human_size(@size)
        @uploaded = help.number_to_human_size(@uploaded)
        @remaining = help.number_to_human_size(@remaining)
        @downloaded = help.number_to_human_size(@downloaded)
        @down_rate = help.number_to_human_size(@down_rate)
        @up_rate = help.number_to_human_size(@up_rate)
    end

    def to_param
        @hash
    end

end

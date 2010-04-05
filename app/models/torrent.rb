require 'xmlrpc/client'
require 'cgi'

APP_CONFIG = YAML.load_file("#{RAILS_ROOT}/config/config.yml")[RAILS_ENV]

def server_call(*args)
    begin
        s = XMLRPC::Client.new2(APP_CONFIG['rtorrent_scgi'])
        s.call(*args)
    rescue XMLRPC::FaultException => e
        puts "Error: "
        puts e.faultCode
        puts e.faultString
    end
end

class TorrentFile
    def initialize(details)
    end
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
            methods = %w(
                main d.get_hash= d.get_base_filename= d.get_base_path=
                d.get_state= d.get_completed_bytes= d.get_size_bytes= d.get_left_bytes=
                d.get_down_rate= d.get_up_rate= d.get_bytes_done= d.get_up_total=
                d.get_creation_date= d.get_complete= d.is_active= d.is_hash_checking=
                d.get_ratio=
            )
            completed = server_call("d.multicall", methods)
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

    def mime_img(name)
        case File.extname(name).gsub( /^\./, '' ).downcase
        when 'avi', 'mkv'
            return 'mime-video'
        when 'jpg', 'gif', 'jpeg'
            return 'mime-image'
        when 'mp3', 'wav', 'ogg'
            return 'mime-audio'
        when 'rar', 'zip', 'gz', 'tar'
            return 'mime-archive'
        when 'txt'
            return 'mime-text'
        when nil
            return 'mime-folder'
        else
            return 'mime-unknown'
        end
    end

    def ratio_img(ratio)
        if ratio >= 0.90
            return 'face-grin'
        elsif ratio >= 0.75
            return 'face-smile-big'
        elsif ratio >= 0.60
            return 'face-smile'
        elsif ratio >= 0.50
            return 'face-plain'
        elsif ratio >= 0.30
            return 'face-sad'
        else
            return 'face-crying'
        end
    end

    def get_files(hash)
        begin
            methods = %w(f.get_path=)
            # f.get_path= f.get_path_components= f.get_path_depth=
                # f.get_is_open= f.get_priority= f.get_size_bytes=
                # f.get_completed_chunks= f.get_size_chunks=)
            files = server_call("f.multicall", hash, '1', methods)
            puts files
            files.map { |t| TorrentFile.new(t) }
        rescue SocketError, Errno::ECONNREFUSED => e
            print "Error: Could not connect to server '%s' (%s)\r\n" % [APP_CONFIG['rtorrent_scgi'], e]
            files = []
        end
        return files
    end

    def initialize(details)
        @hash, @name, @base_path, @state, @completed_bytes, @size, @left_bytes, @down_rate,
        @up_rate, @downloaded, @uploaded, @creation_date, @complete, @is_active, @is_checking, @ratio = details

        begin
            @remaining = @size - @downloaded
            @percentage = sprintf("%.2f", (Float(@downloaded) / Float(@size) * 100))
            @ratio = ("%0.2f" % (Float(@ratio) / 1000.0))
            @size = help.number_to_human_size(@size)
            @uploaded = help.number_to_human_size(@uploaded)
            @remaining = help.number_to_human_size(@remaining)
            @downloaded = help.number_to_human_size(@downloaded)
            @down_rate = help.number_to_human_size(@down_rate)
            @up_rate = help.number_to_human_size(@up_rate)
            @ratio_img = ratio_img(@ratio.to_f)
            @mime_img = mime_img(@name)
            # @files = get_files(@hash)
        rescue => e
            print "Error: %s\r\n" % e
        end
    end

    def to_param
        @hash
    end

end

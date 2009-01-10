module IndexHelper

    def file_type(file_name)
        File.extname(file_name).gsub( /^\./, '' ).downcase
    end

    def get_mime_icon(file)
        case file_type(file)
        when 'avi', 'mkv'
            return 'mime-video'
        when 'jpg'
            return 'mime-image'
        when 'mp3'
            return 'mime-audio'
        when 'rar'
            return 'mime-archive'
        when 'txt'
            return 'mime-text'
        when nil
            return 'mime-folder'
        else
            return 'mime-unknown'
        end
    end

    def get_ratio_icon(ratio)
        ratio = Float(ratio)
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

end

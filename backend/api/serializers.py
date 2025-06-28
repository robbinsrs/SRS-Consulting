from rest_framework import serializers
import re
from .models import ContactRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    """Serializer for ContactRequest model."""
    
    services_display = serializers.SerializerMethodField()
    
    class Meta:
        model = ContactRequest
        fields = ['id', 'name', 'email', 'phone', 'services_needed', 'services_display', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_services_display(self, obj):
        """Return human-readable service names."""
        return obj.get_services_display()
    
    def validate_email(self, value):
        """Comprehensive email validation."""
        if not value:
            raise serializers.ValidationError("Email is required.")
        
        # Convert to lowercase for consistency
        email = value.lower().strip()
        
        # RFC 5322 compliant email regex
        email_regex = re.compile(r'^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$')
        
        if not email_regex.match(email):
            raise serializers.ValidationError("Please enter a valid email address.")
        
        # Length checks
        if len(email) > 254:
            raise serializers.ValidationError("Email address is too long (maximum 254 characters).")
        
        # Split email into local and domain parts
        try:
            local_part, domain = email.split('@', 1)
        except ValueError:
            raise serializers.ValidationError("Email address must contain exactly one @ symbol.")
        
        # Local part validation
        if len(local_part) > 64:
            raise serializers.ValidationError("Email local part is too long (maximum 64 characters).")
        
        if local_part.startswith('.') or local_part.endswith('.'):
            raise serializers.ValidationError("Email local part cannot start or end with a dot.")
        
        # Domain validation
        if len(domain) > 253:
            raise serializers.ValidationError("Email domain is too long (maximum 253 characters).")
        
        if domain.startswith('.') or domain.endswith('.'):
            raise serializers.ValidationError("Email domain cannot start or end with a dot.")
        
        if '..' in domain:
            raise serializers.ValidationError("Email domain cannot contain consecutive dots.")
        
        # Check for valid domain format
        domain_parts = domain.split('.')
        if len(domain_parts) < 2:
            raise serializers.ValidationError("Email domain must have at least one dot.")
        
        for part in domain_parts:
            if not part or len(part) > 63:
                raise serializers.ValidationError("Email domain parts must be between 1 and 63 characters.")
            if part.startswith('-') or part.endswith('-'):
                raise serializers.ValidationError("Email domain parts cannot start or end with a hyphen.")
        
        # Common disposable email domains (add more as needed)
        disposable_domains = {
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
            'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'sharklasers.com',
            'yopmail.com', 'getnada.com', 'mailnesia.com', 'trashmail.com',
            'dispostable.com', 'maildrop.cc', 'tempr.email', 'spam4.me'
        }
        
        if domain in disposable_domains:
            raise serializers.ValidationError("Please use a valid email address (disposable emails not allowed).")
        
        # Australian email domains and providers
        australian_domains = {
            # Major Australian ISPs and providers
            'bigpond.com', 'bigpond.net.au', 'bigpond.com.au',
            'optusnet.com.au', 'optus.com.au',
            'iinet.net.au', 'westnet.com.au', 'internode.on.net',
            'tpg.com.au', 'tpg.net.au',
            'telstra.com', 'telstra.com.au',
            'dodo.com.au', 'dodo.net.au',
            'exetel.com.au',
            'aussiebroadband.com.au',
            'superloop.com.au',
            'belong.com.au',
            'vodafone.com.au',
            'amaysim.com.au',
            'aldimobile.com.au',
            
            # Australian business and government domains
            'gov.au', 'govt.au', 'gov.au',
            'edu.au', 'education.au',
            'org.au', 'net.au', 'com.au',
            'asn.au', 'id.au',
            
            # Australian universities and educational institutions
            'unimelb.edu.au', 'sydney.edu.au', 'anu.edu.au', 'uq.edu.au',
            'monash.edu.au', 'unsw.edu.au', 'uts.edu.au', 'qut.edu.au',
            'rmit.edu.au', 'deakin.edu.au', 'latrobe.edu.au', 'swinburne.edu.au',
            'curtin.edu.au', 'uwa.edu.au', 'adelaide.edu.au', 'flinders.edu.au',
            'newcastle.edu.au', 'griffith.edu.au', 'bond.edu.au', 'jcu.edu.au',
            'usc.edu.au', 'cqu.edu.au', 'ecu.edu.au', 'murdoch.edu.au',
            'usc.edu.au', 'scu.edu.au', 'une.edu.au', 'csu.edu.au',
            
            # Australian banks and financial institutions
            'cba.com.au', 'commbank.com.au', 'commonwealthbank.com.au',
            'westpac.com.au', 'nab.com.au', 'anz.com.au',
            'bendigobank.com.au', 'bendigoadelaide.com.au',
            'stgeorge.com.au', 'bankofmelbourne.com.au', 'bankwest.com.au',
            'rams.com.au', 'ubank.com.au', '86400.com.au',
            
            # Australian media and news
            'abc.net.au', 'sbs.com.au', 'nine.com.au', 'seven.com.au',
            'ten.com.au', 'news.com.au', 'smh.com.au', 'theage.com.au',
            'afr.com.au', 'brisbanetimes.com.au', 'watoday.com.au',
            'perthnow.com.au', 'adelaidenow.com.au', 'heraldsun.com.au',
            'dailytelegraph.com.au', 'couriermail.com.au', 'ntnews.com.au',
            'townsvillebulletin.com.au', 'cairnspost.com.au', 'goldcoastbulletin.com.au',
            'geelongadvertiser.com.au', 'bendigoadvertiser.com.au',
            
            # Australian retail and e-commerce
            'woolworths.com.au', 'coles.com.au', 'aldi.com.au',
            'kmart.com.au', 'target.com.au', 'bigw.com.au',
            'harveynorman.com.au', 'thegoodguys.com.au', 'jbhi-fi.com.au',
            'officeworks.com.au', 'bunnings.com.au', 'bunnings.com.au',
            'rebel.com.au', 'amart.com.au', 'supercheapauto.com.au',
            'autobarn.com.au', 'repco.com.au', 'superretailgroup.com.au',
            
            # Australian telecommunications
            'telstra.com.au', 'optus.com.au', 'vodafone.com.au',
            'virginmobile.com.au', 'boost.com.au', 'amaysim.com.au',
            'aldimobile.com.au', 'belong.com.au', 'felix.com.au',
            'circles.life', 'moose.com.au', 'koganmobile.com.au',
            
            # Australian utilities and services
            'agl.com.au', 'originenergy.com.au', 'energyaustralia.com.au',
            'powershop.com.au', 'redenergy.com.au', 'momentumenergy.com.au',
            'simplyenergy.com.au', 'alintaenergy.com.au', 'powershop.com.au',
            'sydneywater.com.au', 'melbournewater.com.au', 'seqwater.com.au',
            'watercorporation.com.au', 'sa.gov.au', 'act.gov.au',
            
            # Australian transport and logistics
            'qantas.com.au', 'virginaustralia.com', 'jetstar.com.au',
            'rex.com.au', 'tigerair.com.au', 'bonza.com.au',
            'uber.com.au', 'lyft.com.au', 'didi.com.au',
            'taxify.com.au', 'ola.com.au', 'shemesh.com.au',
            
            # Australian real estate
            'realestate.com.au', 'domain.com.au', 'allhomes.com.au',
            'onthehouse.com.au', 'homely.com.au', 'ratemyagent.com.au',
            'raywhite.com.au', 'lre.com.au', 'barryplant.com.au',
            'harcourts.com.au', 'ljhooker.com.au', 'mcgrath.com.au',
            
            # Australian job sites
            'seek.com.au', 'careerone.com.au', 'mycareer.com.au',
            'adzuna.com.au', 'indeed.com.au', 'linkedin.com',
            'glassdoor.com.au', 'jobsearch.gov.au', 'apsjobs.gov.au',
            
            # Australian social media and tech
            'facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com',
            'snapchat.com', 'tiktok.com', 'youtube.com', 'reddit.com',
            'discord.com', 'slack.com', 'zoom.us', 'teams.microsoft.com',
            'google.com', 'microsoft.com', 'apple.com', 'amazon.com.au',
            'ebay.com.au', 'gumtree.com.au', 'facebook.com.au',
            
            # Australian health and medical
            'health.gov.au', 'medicare.gov.au', 'myhealthrecord.gov.au',
            'healthdirect.gov.au', 'bupa.com.au', 'medibank.com.au',
            'hcf.com.au', 'nib.com.au', 'ahm.com.au', 'guild.com.au',
            'pharmacyguild.org.au', 'racgp.org.au', 'ama.com.au',
            
            # Australian sports and entertainment
            'afl.com.au', 'nrl.com.au', 'cricket.com.au', 'footballaustralia.com.au',
            'tennis.com.au', 'golf.org.au', 'rugby.com.au', 'basketball.com.au',
            'netball.com.au', 'hockey.org.au', 'swimming.org.au',
            'ticketek.com.au', 'ticketmaster.com.au', 'moshtix.com.au',
            'eventbrite.com.au', 'humanitix.com.au', 'oztix.com.au',
            
            # Australian automotive
            'carsales.com.au', 'carsguide.com.au', 'drive.com.au',
            'motoring.com.au', 'whichcar.com.au', 'caradvice.com.au',
            'nrma.com.au', 'racv.com.au', 'racq.com.au', 'rac.com.au',
            'aami.com.au', 'gio.com.au', 'shannons.com.au', 'justcar.com.au',
            
            # Australian insurance
            'allianz.com.au', 'aami.com.au', 'gio.com.au', 'shannons.com.au',
            'justcar.com.au', 'nrma.com.au', 'racv.com.au', 'racq.com.au',
            'rac.com.au', 'bingle.com.au', 'coles.com.au', 'woolworths.com.au',
            'budgetdirect.com.au', 'youi.com.au', 'huddle.com.au',
            
            # Australian travel and tourism
            'tripadvisor.com.au', 'booking.com', 'expedia.com.au',
            'wotif.com', 'lastminute.com.au', 'webjet.com.au',
            'flightcentre.com.au', 'studentflights.com.au', 'escape.com.au',
            'lonelyplanet.com', 'visitvictoria.com', 'queensland.com',
            'nsw.gov.au', 'wa.gov.au', 'sa.gov.au', 'tas.gov.au',
            'nt.gov.au', 'act.gov.au',
        }
        
        # Check if domain is Australian (optional validation - you can remove this if you want to allow all domains)
        # This is just for informational purposes and doesn't block non-Australian emails
        is_australian = any(domain.endswith(au_domain) for au_domain in australian_domains)
        
        return email
    
    def validate_name(self, value):
        """Comprehensive name validation."""
        if not value:
            raise serializers.ValidationError("Name is required.")
        
        # Trim whitespace
        name = value.strip()
        
        # Length validation
        if len(name) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        
        if len(name) > 100:
            raise serializers.ValidationError("Name is too long (maximum 100 characters).")
        
        # Check for valid characters (letters, spaces, hyphens, apostrophes, periods)
        name_regex = re.compile(r'^[a-zA-Z\s\-\'\.]+$')
        if not name_regex.match(name):
            raise serializers.ValidationError("Name can only contain letters, spaces, hyphens, apostrophes, and periods.")
        
        # Check for consecutive spaces
        if '  ' in name:
            raise serializers.ValidationError("Name cannot contain consecutive spaces.")
        
        # Check for leading/trailing spaces
        if name != name.strip():
            raise serializers.ValidationError("Name cannot start or end with spaces.")
        
        # Check for at least one letter
        if not re.search(r'[a-zA-Z]', name):
            raise serializers.ValidationError("Name must contain at least one letter.")
        
        # Check for proper capitalization (first letter should be uppercase)
        words = [word for word in name.split(' ') if word]
        if words and words[0] and not words[0][0].isupper():
            raise serializers.ValidationError("Name should start with a capital letter.")
        
        # Check for suspicious patterns (all caps, all lowercase for long names)
        if len(name) > 10:
            if name.isupper():
                raise serializers.ValidationError("Name should not be in all capital letters.")
            if name.islower():
                raise serializers.ValidationError("Name should use proper capitalization.")
        
        # Check for common spam patterns
        spam_patterns = [
            'test', 'admin', 'user', 'guest', 'anonymous', 'unknown',
            'asdf', 'qwerty', '123', 'abc', 'xyz'
        ]
        
        name_lower = name.lower()
        for pattern in spam_patterns:
            if pattern in name_lower:
                raise serializers.ValidationError("Please enter a valid name.")
        
        return name
    
    def validate_services_needed(self, value):
        """Validate that services_needed contains valid service choices."""
        valid_services = [choice[0] for choice in ContactRequest.SERVICE_CHOICES]
        
        if not value:
            raise serializers.ValidationError("At least one service must be selected.")
        
        for service in value:
            if service not in valid_services:
                raise serializers.ValidationError(f"Invalid service: {service}")
        
        return value
    
    def validate_phone(self, value):
        """Basic phone number validation."""
        # Remove common separators and check if it's mostly digits
        cleaned = ''.join(filter(str.isdigit, value))
        if len(cleaned) < 7:
            raise serializers.ValidationError("Phone number must contain at least 7 digits.")
        return value 
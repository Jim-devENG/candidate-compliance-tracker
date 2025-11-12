<x-mail::message>
# Credential Expiry Reminder

Hello,

This is a reminder that a credential is expiring soon.

**Candidate:** {{ $credential->candidate_name }}  
**Position:** {{ $credential->position }}  
**Credential Type:** {{ $credential->credential_type }}  
**Email:** {{ $credential->email }}  
**Issue Date:** {{ $credential->issue_date->format('F d, Y') }}  
**Expiry Date:** {{ $credential->expiry_date->format('F d, Y') }}  
**Days Until Expiry:** {{ $daysUntilExpiry }} day(s)

@if($daysUntilExpiry <= 7)
<x-mail::panel>
⚠️ **Urgent:** This credential expires in {{ $daysUntilExpiry }} day(s). Please take action immediately.
</x-mail::panel>
@else
Please review and renew this credential before it expires.
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
